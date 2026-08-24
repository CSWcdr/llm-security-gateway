import {
    useMemo,
    useState,
  } from "react";
  
  import {
    KeyRound,
    Plus,
    Search,
    ShieldCheck,
  } from "lucide-react";
  
  import { toast } from "sonner";
  
  import ApiKeyRow from "../components/api-keys/ApiKeyRow";
  import ApiKeySecretModal from "../components/api-keys/ApiKeySecretModal";
  import CreateApiKeyModal from "../components/api-keys/CreateApiKeyModal";
  
  import { useApiKeys } from "../hooks/useApiKeys";
  
  import type {
    ApiKeyEnvironment,
  } from "../types";
  
  type StatusFilter =
    | "All"
    | "Active"
    | "Revoked";
  
  export default function ApiKeysPage() {
    const {
      apiKeys,
      createApiKey,
      revokeApiKey,
    } = useApiKeys();
  
    const [search, setSearch] =
      useState("");
  
    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<StatusFilter>(
        "All"
      );
  
    const [
      createModalOpen,
      setCreateModalOpen,
    ] = useState(false);
  
    const [
      secretModalOpen,
      setSecretModalOpen,
    ] = useState(false);
  
    const [
      generatedSecret,
      setGeneratedSecret,
    ] = useState("");
  
    const filteredApiKeys =
      useMemo(() => {
        return apiKeys.filter(
          (apiKey) => {
            const query =
              search.toLowerCase();
  
            const matchesSearch =
              apiKey.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              apiKey.projectName
                .toLowerCase()
                .includes(
                  query
                );
  
            const matchesStatus =
              statusFilter ===
                "All" ||
              apiKey.status ===
                statusFilter;
  
            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );
      }, [
        apiKeys,
        search,
        statusFilter,
      ]);
  
    const activeKeys =
      apiKeys.filter(
        (apiKey) =>
          apiKey.status ===
          "Active"
      ).length;
  
    const revokedKeys =
      apiKeys.filter(
        (apiKey) =>
          apiKey.status ===
          "Revoked"
      ).length;
  
    const totalRequests =
      apiKeys.reduce(
        (total, apiKey) =>
          total +
          apiKey.requestCount,
        0
      );
  
    function handleCreateApiKey(
      input: {
        name: string;
  
        projectId: string;
        projectName: string;
  
        environment:
          ApiKeyEnvironment;
      }
    ) {
      const result =
        createApiKey(input);
  
      setGeneratedSecret(
        result.secret
      );
  
      setSecretModalOpen(
        true
      );
  
      toast.success(
        "API key generated"
      );
    }
  
    function handleRevoke(
      apiKeyId: string
    ) {
      const confirmed =
        window.confirm(
          "Revoke this API key? Applications using it will immediately lose gateway access."
        );
  
      if (!confirmed) {
        return;
      }
  
      revokeApiKey(apiKeyId);
  
      toast.success(
        "API key revoked"
      );
    }
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
  
          <div>
  
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              API Keys
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Manage credentials used by applications to authenticate with your gateway.
            </p>
  
          </div>
  
          <button
            onClick={() =>
              setCreateModalOpen(
                true
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Plus size={17} />
  
            Create API Key
          </button>
  
        </div>
  
        {/* Security Notice */}
        <div className="flex gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
  
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-blue-400"
          />
  
          <div>
  
            <p className="text-sm font-medium text-blue-300">
              Secure credential management
            </p>
  
            <p className="mt-1 text-xs leading-5 text-blue-200/50">
              Full API key secrets are displayed only once when generated. Existing credentials are shown using masked identifiers.
            </p>
  
          </div>
  
        </div>
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <StatCard
            label="Total Keys"
            value={
              apiKeys.length.toString()
            }
          />
  
          <StatCard
            label="Active Keys"
            value={
              activeKeys.toString()
            }
            valueClassName="text-emerald-400"
          />
  
          <StatCard
            label="Revoked"
            value={
              revokedKeys.toString()
            }
            valueClassName="text-red-400"
          />
  
          <StatCard
            label="Authenticated Requests"
            value={totalRequests.toLocaleString()}
          />
  
        </div>
  
        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:flex-row">
  
          <div className="relative flex-1">
  
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
  
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search API keys or projects..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
            />
  
          </div>
  
          <div className="flex gap-2">
  
            {(
              [
                "All",
                "Active",
                "Revoked",
              ] as StatusFilter[]
            ).map((status) => (
  
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(
                    status
                  )
                }
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  statusFilter ===
                  status
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {status}
              </button>
  
            ))}
  
          </div>
  
        </div>
  
        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="flex items-center gap-2 border-b border-slate-800 p-5">
  
            <KeyRound
              size={17}
              className="text-violet-400"
            />
  
            <div>
  
              <h2 className="text-sm font-semibold text-white">
                Gateway Credentials
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Credentials registered with your security gateway.
              </p>
  
            </div>
  
          </div>
  
          <div className="overflow-x-auto">
  
            <table className="w-full text-left">
  
              <thead>
  
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-600">
  
                  <th className="px-5 py-3 font-medium">
                    Key
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Project
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Requests
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Last Used
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Created
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Action
                  </th>
  
                </tr>
  
              </thead>
  
              <tbody>
  
                {filteredApiKeys.map(
                  (apiKey) => (
                    <ApiKeyRow
                      key={
                        apiKey.id
                      }
                      apiKey={
                        apiKey
                      }
                      onRevoke={
                        handleRevoke
                      }
                    />
                  )
                )}
  
              </tbody>
  
            </table>
  
          </div>
  
          {filteredApiKeys.length ===
            0 && (
            <div className="py-16 text-center">
  
              <p className="text-sm text-slate-400">
                No API keys found.
              </p>
  
              <p className="mt-1 text-xs text-slate-600">
                Try changing your search or filter.
              </p>
  
            </div>
          )}
  
        </div>
  
        <CreateApiKeyModal
          open={
            createModalOpen
          }
          onClose={() =>
            setCreateModalOpen(
              false
            )
          }
          onCreate={
            handleCreateApiKey
          }
        />
  
        <ApiKeySecretModal
          open={
            secretModalOpen
          }
          secret={
            generatedSecret
          }
          onClose={() => {
  
            setSecretModalOpen(
              false
            );
  
            /*
             * Remove full secret
             * from React memory once
             * user closes it.
             */
            setGeneratedSecret(
              ""
            );
          }}
        />
  
      </div>
    );
  }
  
  function StatCard({
    label,
    value,
    valueClassName = "text-white",
  }: {
    label: string;
    value: string;
    valueClassName?: string;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
  
        <p className="text-xs text-slate-500">
          {label}
        </p>
  
        <p
          className={`mt-2 text-xl font-semibold ${valueClassName}`}
        >
          {value}
        </p>
  
      </div>
    );
  }