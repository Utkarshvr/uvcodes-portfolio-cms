import ToolType from "@/type/ToolType";
import { create } from "zustand";

// create an interface for the store to implement
interface ToolStore {
  tools: ToolType[];
  setTools: (tools: ToolType[]) => void;
  isFetching: boolean;
  setIsFetching: (newState: boolean) => void;
}

// create the bear store, implementing the Store interface
const useTools = create<ToolStore>((set) => ({
  tools: [],
  setTools(tools: ToolType[]) {
    set(() => ({ tools }));
  },

  isFetching: true,
  setIsFetching(newState: boolean) {
    set(() => ({ isFetching: newState }));
  },
}));

// export the useTools hook
export default useTools;
