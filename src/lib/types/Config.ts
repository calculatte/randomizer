import { Course } from "$lib/types/Course.svelte";
import type { Partition } from "$lib/types/Partition.svelte";
import type { Serializer } from "svelte-persisted-store";

export class Config {
    version: string;
    courses: Course[];

    constructor(courses?: Course[]) {
        this.version = "0.0.1";
        this.courses = courses || [];
    }

    public addCourse(name: string, description?: string): Course {
        const course = new Course(name, description == null ? "" : description);
        this.courses.push(course);

        return course;
    }

    public removeCourse(id: string): void {
        this.courses = this.courses.filter((course: Course): boolean => course.id !== id);
    }

    public findCourse(id: string): Course | undefined {
        return this.courses.find((course: Course): boolean => course.id === id);
    }

    public getSelectedCourses(): Course[] {
        return this.courses.filter(course => course.runtime.selected);
    }

    public getSelectedPartitions(): Partition[] {
        return this.getSelectedCourses().flatMap(course => course.partitions.filter(partition => partition.runtime.selected));
    }

    public download(): void {
        const json = JSON.stringify(this, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "config.json";
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    public static serializer: Serializer<Config> = {
        parse(text: string): Config {
            const parsed: any = JSON.parse(text);
            const config: Config = new Config();

            if (Array.isArray(parsed.courses)) {
                parsed.courses.forEach((course: any): void => {
                    if (typeof course.name == "string" && typeof course.description == "string") {
                        const courseInstance: Course = config.addCourse(course.name, course.description);

                        if (typeof course.id == "string") {
                            courseInstance.id = course.id;
                        }

                        if (Array.isArray(course.partitions))
                        {
                            course.partitions.forEach((partition: any): void => {
                                const partitionInstance: Partition = courseInstance.addPartition(partition.name, partition.description);

                                if (typeof partition.id == "string") {
                                    partitionInstance.id = partition.id;
                                }

                                if (typeof partition.startAt == "number") {
                                    partitionInstance.setStartAt(partition.startAt);
                                }

                                if (typeof partition.endAt == "number") {
                                    partitionInstance.setEndAt(partition.endAt);
                                }
                            });
                        }
                    }
                });
            }

            return config;
        },

        stringify(object: Config): string {
            return JSON.stringify(object);
        }
    };
}