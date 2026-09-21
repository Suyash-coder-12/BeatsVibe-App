import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";

const PORT = 5000;
const RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs";
const RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4";

const app = new Application();
const router = new Router();
const ROOT_DIR = `${Deno.cwd()}/..`;

// Add CORS
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }
  await next();
});

const sendHtml = async (ctx: any, path: string) => {
  try {
    const file = await Deno.readFile(`${ROOT_DIR}/${path}`);
    ctx.response.body = file;
    ctx.response.type = "text/html";
  } catch (e) {
    ctx.response.status = 404;
    ctx.response.body = "Not Found";
  }
};

const htmlRoutes = [
  { path: "/", file: "index.html" },
  { path: "/index.html", file: "index.html" },
  { path: "/dashboard", file: "dashboard.html" },
  { path: "/dashboard.html", file: "dashboard.html" },
  { path: "/course-details", file: "course-details.html" },
  { path: "/course-details.html", file: "course-details.html" },
  { path: "/login", file: "login.html" },
  { path: "/login.html", file: "login.html" },
  { path: "/register", file: "register.html" },
  { path: "/register.html", file: "register.html" },
  { path: "/programs", file: "programs.html" },
  { path: "/programs.html", file: "programs.html" },
  { path: "/admin", file: "admin.html" },
  { path: "/admin.html", file: "admin.html" }
];

for (const route of htmlRoutes) {
  router.get(route.path, async (ctx) => {
    await sendHtml(ctx, route.file);
  });
}

router.post("/api/payment/create-order", async (ctx) => {
  try {
    const body = ctx.request.body();
    const data = await body.value;
    
    const amount = (data.amount || 0) * 100;
    const studentId = data.studentId || "unknown";
    
    const authString = `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`;
    const encodedAuth = encodeBase64(authString);
    
    const payload = {
      amount: amount,
      currency: "INR",
      receipt: `rcpt_${studentId}_${Date.now()}`
    };
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedAuth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const orderData = await response.json();
    ctx.response.body = { success: true, order: orderData };
    
  } catch (error) {
    console.error("Order Creation Error:", error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: "Something went wrong with Razorpay!" };
  }
});

// Fallback for static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: ROOT_DIR,
      index: "index.html",
    });
  } catch (e) {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`[SYS] BeatsVibe Deno Server active on port ${PORT}`);
await app.listen({ port: PORT });
