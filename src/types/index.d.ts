interface User {
    id: string;
    name: string;
    email: string;
    height: { feet: number; inches: number };
    weight: number;
    dob: Date;
    photoURL: string;
}
interface LinksData {
    link: string;
    label: string;
    icon: Icon;
    links?: { link: string; label: string; access: Roles[] }[];
    exact?: boolean;
}
