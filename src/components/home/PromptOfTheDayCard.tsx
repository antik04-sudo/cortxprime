import { promptOfTheDay } from "../../utils/promptRotation";
import Panel from "../ui/Panel";
import Label from "../ui/Label";
import styles from "./PromptOfTheDayCard.module.css";

export default function PromptOfTheDayCard() {
  return (
    <Panel>
      <Label>Today's mindset</Label>
      <p className={styles.prompt}>{promptOfTheDay()}</p>
    </Panel>
  );
}
