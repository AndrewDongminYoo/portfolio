import { NextApiRequest, NextApiResponse } from "next";

export default function hello(_: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ text: "Hello" });
}
