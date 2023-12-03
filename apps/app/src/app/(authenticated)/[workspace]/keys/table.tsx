import { Pill } from "@floe/ui";
import type { Prisma } from "@floe/db";

export function Table({
  workspace,
}: {
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      encrytpedKeys: {
        select: {
          name: true;
          slug: true;
          createdAt: true;
        };
      };
    };
  }>;
}) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            scope="col"
          >
            Name
          </th>
          <th
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            scope="col"
          >
            Token
          </th>
          <th
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            scope="col"
          >
            Created
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {workspace.encrytpedKeys.map((key) => (
          <tr key={key.slug}>
            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
              {key.name}
            </td>
            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
              <Pill
                color="gray"
                fontStlye="mono"
                text={`secret_••••••••••••••••${key.slug}`}
              />
            </td>
            <td className="flex items-center gap-1 px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
              {new Date(key.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
