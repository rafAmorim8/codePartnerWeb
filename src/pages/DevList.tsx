import { useContext } from "react";
import { AuthContext } from "../App";

export function DevList() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dev List</h1>
      <h3>{user?.name}</h3>
    </div>
  );
}