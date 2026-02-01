import { dev } from "$app/environment";

export const Home = dev ? "/" : "/randomizer/";

function getRef(ref: string): string {
    return dev ? "/" + ref : Home + ref;
}

export const Courses = getRef("courses");
export const Settings = getRef("settings");