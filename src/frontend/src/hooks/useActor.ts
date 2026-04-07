import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/**
 * Pre-configured useActor hook for TruckBandhu backend.
 * Returns { actor, isFetching } with the backend interface.
 * Actor methods that don't exist in the interface return null/empty gracefully.
 */
// biome-ignore lint/suspicious/noExplicitAny: actor is dynamically typed
export function useActor(): { actor: any; isFetching: boolean } {
  // createActor needs uploadFile and downloadFile stubs for the type signature
  // The backend.ts requires these for object-storage but our backend doesn't use them
  const uploadStub = async (_file: unknown) => new Uint8Array();
  const downloadStub = async (_bytes: Uint8Array) =>
    ({ directURL: "", getBytes: async () => new Uint8Array() }) as never;

  const wrappedCreate = (canisterId: string, options: unknown) => {
    return createActor(canisterId, uploadStub, downloadStub, options as never);
  };

  return useActorBase(wrappedCreate as never);
}
