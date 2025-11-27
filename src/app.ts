import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import router from "./app/routes/index";
import passport from "passport";
import expressSession from "express-session";
const app = express();

app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// User Apis

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>System Status</title>

      <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

          body {
              margin: 0;
              font-family: 'Orbitron', sans-serif;
              background: radial-gradient(circle at center, #0a0f1f, #000);
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              color: #00eaff;
          }

          /* Animated Grid Background */
          .grid {
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: 
                  linear-gradient(transparent 97%, rgba(0,255,255,0.1)),
                  linear-gradient(90deg, transparent 97%, rgba(0,255,255,0.1));
              background-size: 40px 40px;
              animation: moveGrid 5s linear infinite;
          }

          @keyframes moveGrid {
              from { background-position: 0 0; }
              to { background-position: 40px 40px; }
          }

          /* Central Hologram Card */
          .container {
              position: relative;
              backdrop-filter: blur(12px);
              background: rgba(0, 255, 255, 0.05);
              border: 1px solid rgba(0,255,255,0.3);
              box-shadow: 0 0 30px rgba(0,255,255,0.2), inset 0 0 40px rgba(0,255,255,0.1);
              padding: 40px 60px;
              border-radius: 20px;
              z-index: 2;
              text-align: center;
              animation: fadeIn 1.5s ease;
          }

          @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
          }

          h1 {
              font-size: 45px;
              margin: 0 0 10px;
              color: #00eaff;
              text-shadow: 0 0 15px #00eaff;
          }

          .pulse {
              font-size: 60px;
              margin-top: 20px;
              animation: pulse 1.4s infinite;
          }

          @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.15); opacity: 0.7; }
              100% { transform: scale(1); opacity: 1; }
          }

          .tag {
              margin-top: 15px;
              font-size: 16px;
              opacity: 0.7;
              letter-spacing: 3px;
          }

          /* Floating particles */
          .particle {
              position: absolute;
              width: 4px;
              height: 4px;
              background: #00eaff;
              border-radius: 50%;
              animation: float 6s linear infinite;
              opacity: 0.6;
          }

          @keyframes float {
              0% { transform: translateY(0); opacity: 0.1; }
              50% { opacity: 1; }
              100% { transform: translateY(-1200px); opacity: 0; }
          }
      </style>
  </head>

  <body>
      <div class="grid"></div>

      <!-- Random Particles -->
      <script>
          for (let i = 0; i < 40; i++) {
              const p = document.createElement('div');
              p.className = 'particle';
              p.style.left = Math.random() * window.innerWidth + 'px';
              p.style.top = Math.random() * window.innerHeight + 'px';
              p.style.animationDuration = (4 + Math.random() * 4) + 's';
              document.body.appendChild(p);
          }
      </script>

      <div class="container">
          <h1>🛡 SYSTEM ONLINE</h1>
          <p class="tag">TOUR MANAGEMENT BACKEND</p>
          <div class="pulse">⚡</div>
      </div>

  </body>
  </html>
  `;

  res.send(html);
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
