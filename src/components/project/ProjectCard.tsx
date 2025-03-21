import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProjectType from "@/type/ProjectType";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

function shortenStr(str: string, maxLength: number) {
  let count = 0;
  let newStr = "";
  for (const char of str) {
    if (count < maxLength) {
      newStr = newStr + char;
      count++;
    } else return newStr;
  }
}

export default function ProjectCard({ project }: { project: ProjectType }) {
  if (!project?.id) return <p>Project ID not available</p>;
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 items-center">
          <img
            src={project?.icon}
            className="h-9 rounded-full w-9 object-contain"
          />

          {project.title}
        </CardTitle>
        <CardDescription>
          {project.description && project.description.length > 30
            ? `${shortenStr(project.description, 80)}...`
            : project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {project.images &&
              project.images.map((img) => (
                <CarouselItem
                  key={img}
                  className="flex justify-center items-center"
                >
                  <img
                    src={img}
                    className="h-[240px] w-[300px] object-contain"
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-5%] z-50" />
          <CarouselNext className="right-[-5%] z-50" />
        </Carousel>
        <div className="flex flex-row justify-center w-full gap-2 items-center">
          <Link to={project.source_code}  target="_blank">
            <Button variant="link">Source</Button>
          </Link>
          <Link to={project.visit_link} target="_blank">
            <Button variant="link">Link</Button>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link className="w-full" to={project.id}>
          <Button className="w-full" variant="outline">
            View <ChevronRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
