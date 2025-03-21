export default interface ContentBlockType {
  id?: string;
  title: string;
  text?: string;
  type?: "text" | "link";
}
