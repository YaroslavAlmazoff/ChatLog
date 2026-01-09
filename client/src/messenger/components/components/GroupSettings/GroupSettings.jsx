import GroupGoBack from "../GroupGoBack";
import GroupActions from "./GroupActions";
import GroupInfo from "./GroupInfo";
import GroupMembers from "./GroupMembers";

export default function GroupSettings() {
  return (
    <>
      <GroupGoBack />
      <GroupInfo />
      <GroupActions />
      <GroupMembers />
    </>
  );
}
