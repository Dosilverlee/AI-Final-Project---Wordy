import request from "supertest";
import express from "express";
import authRouter from "../routers/authRouter";
import passport from "passport";
import { local } from "../passport";
import { jwt } from "../passport";

const app = express();
app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
app.use(express.json());
app.use("/auth", authRouter);

export async function signUpUser() {
    const res = await request(app).post("/auth/signup").send({
        email: "tests@example.com",
        password: "password",
        name: "Test User",
        nickname: "testuser",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toContain("회원가입에 성공했습니다");
}

export async function loginUser() {
    const res = await request(app).post("/auth").send({
        email: "tests@example.com",
        password: "password",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toEqual("Test User");
    expect(res.body.nickname).toEqual("testuser");

    return res.body.token;
}

export async function deleteUser(userToken: string) {
    const res = await request(app)
        .delete("/auth")
        .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(204);
}
