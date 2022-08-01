import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { createSearchParams } from "react-router-dom";
import { ICourse } from "../../types/course";
import { getConfig, useSession } from "../../utils/auth";
import { baseURL } from "../../utils/constants";
import { debounce } from "../../utils/debounce";
import CourseCard from "../Dashboard/CourseCard";
import DashboardIndex, { FALLBACK_IMG } from "../Dashboard/DashboardIndex";
import Banner from "../Hub/Banner";
import LoadingCard from "../Loading/LoadingCard";

const COURSES_PER_FETCH = 6;

const FeaturedIndex = () => {
  const { user } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: courses,
    fetchNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery(
    ["featured", searchQuery],
    async ({ pageParam = 0 }) => {
      if (!user) {
        throw new Error("User is not defined");
      }
      const res = await axios.get<ICourse[]>(
        `${baseURL}/course/featured/get?${createSearchParams({
          limit: `${COURSES_PER_FETCH}`,
          skip: `${pageParam}`,
          query: searchQuery,
        })}`,
        getConfig(user?.sessionToken)
      );

      return { data: res.data, currentPage: pageParam };
    },
    {
      getNextPageParam: (params) => {
        if (params.data.length < COURSES_PER_FETCH) return undefined;
        return params.currentPage + params.data.length;
      },
      enabled: !!user,
    }
  );

  useEffect(() => {
    window.addEventListener("scroll", handlePageBottom);

    return () => {
      window.removeEventListener("scroll", handlePageBottom);
    };
  }, []);

  const handlePageBottom = debounce(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !isFetching
    ) {
      fetchNextPage();
    }
  }, 500);

  const handleSearchChange = debounce(
    (query: string) => setSearchQuery(query.toLocaleLowerCase()),
    300
  );

  return (
    <>
      <Banner src="https://images.unsplash.com/photo-1514820720301-4c4790309f46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80" />
      <Container maxW={"container.xl"}>
        <Flex flexDir={"column"} gap={4}>
          <Heading as="h1" fontWeight="bold" fontSize="4xl" mt={10}>
            Featured Courses
          </Heading>
          <Text>Courses submitted by the community </Text>
          <Input
            placeholder="Search any featured course!"
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
          />
          <HStack>
            <Button>Submit an existing course</Button>
            <Button>Create a new course</Button>
          </HStack>
          <Grid
            templateColumns={["1fr", "1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
            gap="1em"
            mt={10}
            mb={"200px"}
          >
            {isLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : (
              courses &&
              courses.pages.map((page) =>
                page.data.map((course) => (
                  <CourseCard
                    key={course.objectId}
                    link={course.objectId}
                    title={course.name}
                    src={
                      course.images
                        ? course.images[2]
                          ? course.images[2].regular
                          : FALLBACK_IMG
                        : FALLBACK_IMG
                    }
                    cloneButton
                    createdAt={course.createdAt}
                    liked={false}
                  />
                ))
              )
            )}
            {isFetching && (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            )}
          </Grid>
        </Flex>
      </Container>
    </>
  );
};

export default FeaturedIndex;
