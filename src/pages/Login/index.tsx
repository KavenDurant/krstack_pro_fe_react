import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  // Atmospheric Network Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 25000); // Fewer particles for cleaner look
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2, // Very slow movement
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const draw = () => {
      // Deep, rich gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f172a"); // Slate 900
      gradient.addColorStop(1, "#1e293b"); // Slate 800
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle particles
      ctx.fillStyle = "rgba(148, 163, 184, 0.3)"; // Slate 400, low opacity
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)"; // Very faint lines

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.lineWidth = 1 - dist / 120;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  interface LoginFormValues {
    username: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      const { authApi } = await import("../../api");
      const { STORAGE_KEY } = await import("../../api/config");

      const response = await authApi.login({
        user_name: values.username,
        password: values.password,
      });

      // 后端直接返回数据，没有 code 字段
      const data = response.data;

      console.log("✅ Login Success:", {
        jwt_token: data.jwt_token
          ? `${data.jwt_token.substring(0, 20)}...`
          : "null",
        user_name: data.user_name,
      });

      // 保存 token
      localStorage.setItem(STORAGE_KEY.TOKEN, data.jwt_token);
      localStorage.setItem(STORAGE_KEY.IS_AUTHENTICATED, "true");

      // 保存用户信息
      const userInfo = {
        user_id: data.user_id,
        user_name: data.user_name,
        nickname: data.nickname,
        user_type: data.user_type,
      };
      localStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));

      console.log("💾 Saved to localStorage:", {
        tokenKey: STORAGE_KEY.TOKEN,
        token:
          localStorage.getItem(STORAGE_KEY.TOKEN)?.substring(0, 20) + "...",
        userInfo: localStorage.getItem(STORAGE_KEY.USER_INFO),
      });

      // 验证保存是否成功
      console.group("🔍 Verification");
      console.log("Can read token?", !!localStorage.getItem(STORAGE_KEY.TOKEN));
      console.log(
        "Token matches?",
        localStorage.getItem(STORAGE_KEY.TOKEN) === data.jwt_token
      );
      console.log("All localStorage keys:", Object.keys(localStorage));
      console.groupEnd();

      message.success("欢迎回来");

      // 延迟跳转，确保数据已保存
      setTimeout(() => {
        navigate("/hosts");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      message.error("登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    height: 48,
    borderRadius: 6,
    backdropFilter: "blur(4px)",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          padding: "48px",
          background: "rgba(30, 41, 59, 0.7)", // Slate 800 with opacity
          backdropFilter: "blur(20px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 24px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // Blue 500 to 600
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "#fff",
            }}
          >
            <UserOutlined />
          </div>
          <Title
            level={3}
            style={{
              color: "#fff",
              margin: "0 0 8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            KRSTACK PRO
          </Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
            企业级云管理平台
          </Text>
        </div>

        <Form name="login" onFinish={onFinish} size="large" layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: "" }]}>
            <Input
              prefix={
                <UserOutlined style={{ color: "rgba(255, 255, 255, 0.4)" }} />
              }
              placeholder="账号"
              style={inputStyle}
              className="login-input"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "" }]}>
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "rgba(255, 255, 255, 0.4)" }} />
              }
              placeholder="密码"
              style={inputStyle}
              className="login-input"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 48,
                background: "#3b82f6", // Blue 500
                borderColor: "#3b82f6",
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 6,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                marginTop: 12,
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <style>{`
          .login-input::placeholder { color: rgba(255, 255, 255, 0.3) !important; }
          .login-input:hover, .login-input:focus {
            border-color: rgba(255, 255, 255, 0.3) !important;
            background: rgba(255, 255, 255, 0.08) !important;
          }
          .ant-input-password-icon { color: rgba(255, 255, 255, 0.4) !important; }
          .ant-input-password-icon:hover { color: rgba(255, 255, 255, 0.8) !important; }
        `}</style>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          width: "100%",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.2)",
          fontSize: 12,
        }}
      >
        © 2024 KRStack Inc. All Rights Reserved.
      </div>
    </div>
  );
};

export default Login;
