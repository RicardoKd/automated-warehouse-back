// import type { FastifyInstance } from "fastify/types/instance";

// const rootRoute = "/cells/";

// const routes = {
//   all: rootRoute,
//   putContentInCells: rootRoute + "putContentInCells",
//   rent: rootRoute + "rent",
// };

// const options = {
//   putContentInCells: {
//     schema: {
//       body: {
//         type: "object",
//         required: ["quantityOfCellsToBeUsed", "ownerId", "cellsDescriptions"],
//         properties: {
//           quantityOfCellsToBeUsed: { type: "number" },
//           ownerId: { type: "string" },
//           cellsDescriptions: { type: "array" },
//         },
//       },
//     },
//   },
// };

// /**
//  * A plugin that provide encapsulated routes
//  * @param {FastifyInstance} fastify encapsulated fastify instance
//  */
// const cellRoutes = async (server: FastifyInstance) => {
//   server.post<{
//     Body: {
//       quantityOfCellsToBeUsed: number;
//       ownerId: string;
//       cellsDescriptions: [];
//     };
//   }>(
//     routes.putContentInCells,
//     options.putContentInCells,
//     async (request, reply) => {
//       const { quantityOfCellsToBeUsed, ownerId, cellsDescriptions } =
//         request.body;

//       await this.putContentInCells(
//         quantityOfCellsToBeUsed,
//         ownerId,
//         cellsDescriptions,
//       );

//       reply.status(200).send({ success: true });
//     },
//   );

//   server.post<{
//     Body: {
//       quantityOfCellsToBeUsed: number;
//       rentEndDate: Date;
//       ownerId: string;
//     };
//   }>(routes.rent, (request, reply) => {
//     const { quantityOfCellsToBeUsed, rentEndDate, ownerId } = request.body;

//     rentCells(quantityOfCellsToBeUsed, rentEndDate, ownerId);

//     reply.status(200).send({ success: true });
//   });

//   server.get(routes.all, async (request, reply) => {
//     const result = await this.getCellsInfoOrNull({});

//     reply.status(200).send({ success: true, result });
//   });
// };

// export default cellRoutes;
