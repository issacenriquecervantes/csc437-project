import express, { Request, Response } from "express";
import { CredentialsProvider } from "../providers/CredentialsProvider";

import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
    email: string;
}

function generateAuthToken(email: string, jwtSecret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const payload: IAuthTokenPayload = {
            email
        };
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: express.Application, credentialsProvider: CredentialsProvider) {

    app.post("/auth/register", async (req: Request, res: Response) => {
        //retrieves email and password from the request body
        const { email, password } = req.body;
        //if email or password are undefined in request body, send a HTTP 400 error with an appropriate error message.
        if (email === undefined || password === undefined) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing email or password."
            });
            return;
        }
        //attempt registration
        try {
            //awaits attempt to register user, returns a Promise boolean
            const registeredSuccessfully = await credentialsProvider.registerUser(email, password)

            //if the user was registered successfully, await a token, respond with an HTTP 200, and send token in response, to log in immediately
            if (registeredSuccessfully) {
                const token = await generateAuthToken(email, req.app.locals.JWT_SECRET)
                res.status(201).send(token)
            }
            //if the user was not registered successfully, respond with a HTTP 409 and appropriate error message.
            else {
                res.status(409).send({
                    error: "Bad request",
                    message: "Email is already registered. Try again with a different email."
                })
            }
        }
        //catch any additional errors and respond with a server error and message indicating regitration failure.
        catch {
            res.status(500).send({ error: "Internal Server Error", message: "Failed to register user." });

        }
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        //retrieves email and password from the request body
        const { email, password } = req.body;
        //if email or password are undefined in request body, send a HTTP 400 error with an appropriate error message.
        if (email === undefined || password === undefined) {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing email or password."
            });
            return;
        }
        //attempt login
        try {
            //awaits attempt to log in user, returns a Promise boolean
            const verified = await credentialsProvider.verifyPassword(email, password)

            //if the user was logged in successfully, await a token, respond with an HTTP 200, and send token in response, to log in immediately
            if (verified) {
                const token = await generateAuthToken(email, req.app.locals.JWT_SECRET)
                res.send(token)
            }
            //if the user was not logged in successfully, respond with a HTTP 401 and appropriate error message.
            else {
                res.status(401).send({
                    error: "Unauthorized",
                    message: "There is no user registered with the given email and password pair."
                })
            }
        }
        //catch any additional errors and respond with a server error and message indicating regitration failure.
        catch {
            res.status(500).send({ error: "Internal Server Error", message: "Failed to register user." });
        }

    })



}