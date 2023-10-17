// import {
//   NextApiRequestExtension,
//   NextApiResponseExtension,
// } from "@/lib/types/publicMiddleware";
// import { createHash } from "crypto";
// import prisma from "@floe/db";
// import { defaultResponder } from "@/lib/helpers/defaultResponder";

// async function handler(
//   { body: b, headers, socket }: NextApiRequestExtension,
//   res: NextApiResponseExtension
// ) {
//   const body = b as {
//     type: any;
//     value: boolean;
//     datasourceId: string;
//     filename: string;
//   };

//   const ip = (headers["x-real-ip"] || socket.remoteAddress) as string;

//   /**
//    * TODO: Can use Zod here instead
//    */
//   if (
//     body.datasourceId === undefined ||
//     body.filename === undefined ||
//     body.value === undefined ||
//     body.type === undefined
//   ) {
//     return res.status(400).json({
//       error: {
//         message: "Missing required fields",
//       },
//     });
//   }

//   const hashedIp = createHash("sha256").update(ip).digest("hex");

//   /**
//    * Note: Referential integrity is NOT enforced here.
//    * https://www.prisma.io/docs/concepts/components/prisma-schema/relations/relation-mode#which-foreign-key-constraints-are-emulated
//    *
//    * So, we should manually check if the post exists.
//    */
//   const post = await prisma.post.findUnique({
//     where: {
//       unique_post: {
//         datasourceId: body.datasourceId,
//         filename: body.filename,
//       },
//     },
//   });

//   if (!post) {
//     return res.status(400).json({
//       error: {
//         message: "Post not found",
//       },
//     });
//   }

//   const userReaction = await prisma.reaction.upsert({
//     where: {
//       unique_reaction: {
//         type: body.type,
//         ipAddress: hashedIp,
//         postDataSourceId: body.datasourceId,
//         postFilename: body.filename,
//       },
//     },
//     create: {
//       ipAddress: hashedIp,
//       postDataSourceId: body.datasourceId,
//       postFilename: body.filename,
//       value: body.value,
//       type: body.type,
//     },
//     update: {
//       value: body.value,
//     },
//   });

//   return {
//     data: {
//       userReaction: {
//         type: userReaction.type,
//         value: userReaction.value,
//       },
//     },
//   };
// }

// export default defaultResponder(handler);
