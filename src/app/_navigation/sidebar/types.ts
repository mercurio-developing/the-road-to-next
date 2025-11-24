export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
  separator?:boolean;
};
