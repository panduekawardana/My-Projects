import { app } from "../src/app";
import {describe, expect, it, test } from 'vitest'
import request from "supertest";

describe("Health API", async() => {
  test("Mengembalikan status 200 ketika api aktif", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      message: "Api is running"
    })
  })
});

