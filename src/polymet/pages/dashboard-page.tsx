import React, { useState, useEffect } from "react";
import { MOVIES_DATA, Movie } from "@/polymet/data/movies-data";
import MovieList from "@/polymet/components/movie-list";
import DashboardHeader from "@/polymet/components/dashboard-header";
import { FilterOptions } from "@/polymet/components/movie-filters";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function DashboardPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load of movies - only upcoming movies
  useEffect(() => {
    const loadMovies = () => {
      // Simply show all movies for now to fix the empty state issue
      setMovies(MOVIES_DATA);
      setIsLoading(false);
    };

    // Short timeout to simulate loading
    setTimeout(loadMovies, 300);
  }, []);

  // Listen for filter changes from the sidebar
  useEffect(() => {
    const handleFilterChange = (event: Event) => {
      const customEvent = event as CustomEvent<FilterOptions>;
      applyFilters(customEvent.detail);
    };

    window.addEventListener(
      "filterChange",
      handleFilterChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "filterChange",
        handleFilterChange as EventListener,
      );
    };
  }, []);

  const applyFilters = (filters: FilterOptions) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      let filteredMovies = [...MOVIES_DATA];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredMovies = filteredMovies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(searchLower) ||
            movie.director.toLowerCase().includes(searchLower) ||
            movie.cast.some((actor) =>
              actor.toLowerCase().includes(searchLower),
            ),
        );
      }

      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        filteredMovies = filteredMovies.filter((movie) =>
          filters.category.includes(movie.category),
        );
      }

      // Apply score range filter
      if (filters.scoreRange) {
        filteredMovies = filteredMovies.filter(
          (movie) =>
            movie.score >= filters.scoreRange[0] &&
            movie.score <= filters.scoreRange[1],
        );
      }

      // Apply genre filter
      if (filters.genres && filters.genres.length > 0) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genre.some((genre) => filters.genres.includes(genre)),
        );
      }

      // Apply language filter
      if (filters.language && filters.language.length > 0) {
        filteredMovies = filteredMovies.filter((movie) =>
          filters.language.includes(movie.language),
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "score-desc":
            filteredMovies.sort((a, b) => b.score - a.score);
            break;
          case "score-asc":
            filteredMovies.sort((a, b) => a.score - b.score);
            break;
          case "date-asc":
            filteredMovies.sort(
              (a, b) =>
                new Date(a.debutDate).getTime() -
                new Date(b.debutDate).getTime(),
            );
            break;
          case "date-desc":
            filteredMovies.sort(
              (a, b) =>
                new Date(b.debutDate).getTime() -
                new Date(a.debutDate).getTime(),
            );
            break;
          case "title-asc":
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "title-desc":
            filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
            break;
        }
      }

      setMovies(filteredMovies);
      setIsLoading(false);
    }, 300); // Shorter delay for better UX
  };

  return (
    <div
      className="space-y-6"
      data-pol-id="ew03fa"
      data-pol-file-name="dashboard-page"
      data-pol-file-type="page"
    >
      <DashboardHeader
        title="Upcoming Movies"
        subtitle="Manage and analyze upcoming movie releases for dynamic pricing"
        data-pol-id="7euocu"
        data-pol-file-name="dashboard-page"
        data-pol-file-type="page"
      >
        <Button
          className="flex items-center gap-2"
          data-pol-id="rjf1wo"
          data-pol-file-name="dashboard-page"
          data-pol-file-type="page"
        >
          <PlusIcon
            className="h-4 w-4"
            data-pol-id="pqxe60"
            data-pol-file-name="dashboard-page"
            data-pol-file-type="page"
          />
          Add Movie
        </Button>
      </DashboardHeader>

      <MovieList
        movies={movies}
        isLoading={isLoading}
        data-pol-id="onsy3l"
        data-pol-file-name="dashboard-page"
        data-pol-file-type="page"
      />
    </div>
  );
}
