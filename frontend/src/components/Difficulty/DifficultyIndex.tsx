import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DifficultyCard from "./DifficultyCard";

const DifficultyIndex = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const name = searchParams.get("name");

  return (
    <>
      <Heading as="h1" fontWeight="bold" fontSize="4xl">
        {name}
      </Heading>
      <Box display="flex" flexDir="column" my="1em" gap="1em">
        <DifficultyCard
          title="Beginners"
          progress={20}
          src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          phrase="You can do it!"
          courseId={id || ""}
          courseTitle={name || ""}
          started
          difficulty={1}
        />
        <DifficultyCard
          title="Advanced"
          progress={0}
          src="https://images.unsplash.com/photo-1569748130764-3fed0c102c59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          courseId={id || ""}
          courseTitle={name || ""}
          phrase="Let's go"
          difficulty={2}
        />
      </Box>
    </>
  );
};

export default DifficultyIndex;
