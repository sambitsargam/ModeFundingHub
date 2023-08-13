import type { NextApiRequest, NextApiResponse } from "next";

export type VerifyReply = {
  code: string;
  detail?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyReply>
) {
  const reqBody = {
    merkle_root: req.body.merkle_root,
    nullifier_hash: req.body.nullifier_hash,
    proof: req.body.proof,
    credential_type: req.body.credential_type,
    action: "vote_1",
    signal: req.body.signal ?? "", // if we don't have a signal, use the empty string
  };
  fetch(
    `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }
  ).then((verifyRes) => {
    verifyRes.json().then(async (wldResponse) => {
      if (verifyRes.status == 200) {
        // this is where you should perform backend actions based on the verified credential
        // i.e. setting a user as "verified" in a database
        console.log(JSON.stringify(req.body))
        res.status(verifyRes.status).send({ code: "success" });
      } else {
        // return the error code and detail from the World ID /verify endpoint to our frontend
        res.status(verifyRes.status).send({
          ...wldResponse});
      }
    });
  });
}