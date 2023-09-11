import { Pill } from "@/components/Pill";
import { Clipboard } from "@floe/ui";

export const KeyTable = ({
  slug,
  secretKey,
  hideAccessCol = false,
  secretKeyCopiable = false,
}: {
  slug: string;
  secretKey: string;
  hideAccessCol?: boolean;
  secretKeyCopiable?: boolean;
}) => (
  <table className="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
        >
          Name
        </th>
        {!hideAccessCol && (
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Access
          </th>
        )}
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Token
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr>
        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
          Slug
        </td>
        {!hideAccessCol && (
          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
            Public
          </td>
        )}
        <td className="flex items-center gap-1 px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
          <Pill color="gray" fontStlye="mono" text={slug} />
          <Clipboard text={slug} />
        </td>
      </tr>
      <tr>
        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
          API Key Secret
        </td>
        {!hideAccessCol && (
          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
            Private
          </td>
        )}
        <td className="flex items-center gap-1 px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
          <Pill color="gray" fontStlye="mono" text={secretKey} />
          {secretKeyCopiable && <Clipboard text={secretKey} />}
        </td>
      </tr>
    </tbody>
  </table>
);
