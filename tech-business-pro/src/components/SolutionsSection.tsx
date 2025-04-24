"use client";

import { useQuery } from "@tanstack/react-query";

import { Solution } from "@/lib/types";
import { SOLUTION_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Link from "next/link";

const SolutionsSection = () => {
  const isLoading = true;
  const solutions: Solution[] = [];
  //   const [selectedCategory, setSelectedCategory] = useState<string>("all");

  //   const { data: solutions, isLoading } = useQuery<Solution[]>({
  //     queryKey: [
  //       selectedCategory === "all"
  //         ? "/api/solutions"
  //         : `/api/solutions?category=${selectedCategory}`,
  //     ],
  //   });

  //   //   const handleCategoryChange = (category: string) => {
  //   //     setSelectedCategory(category);
  //   //   };

  //   const getCategoryLabel = (category: string) => {
  //     return (
  //       SOLUTION_CATEGORIES.find((c) => c.value === category)?.label || "Other"
  //     );
  //   };

  //   const getCategoryColor = (category: string) => {
  //     const colorName =
  //       CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "gray";
  //     return {
  //       bg: `bg-${colorName}-100`,
  //       text: `text-${colorName}-800`,
  //     };
  //   };

  return (
    <div id="solutions" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Solution Marketplace
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find the Perfect Tech Solution
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our curated collection of technology solutions designed to
            address your business challenges.
          </p>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap justify-center mb-8 gap-8 ">
            {SOLUTION_CATEGORIES.map((category) => (
              <button
                key={category.value}
                // className={`px-4 py-2 rounded-full font-medium text-sm ${
                //   selectedCategory === category.value
                //     ? "bg-primary-100 text-primary-800"
                //     : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                // }`}
                //  onClick={() => handleCategoryChange(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {isLoading ? (
              // Skeleton loading state
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-7 w-full mb-2" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-5 w-28 ml-2" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))
            ) : solutions && solutions.length > 0 ? (
              solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden card-hover"
                >
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={solution.image_url}
                      alt={solution.title}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span
                      // className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      //   getCategoryColor(solution.category).bg
                      // } ${getCategoryColor(solution.category).text}`}
                      >
                        {/* {getCategoryLabel(solution.category)} */}
                      </span>
                      <span className="text-sm text-gray-500">
                        {solution.regions.join(" & ")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{solution.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        {/* Provider info would come from a join query */}
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-600">SP</span>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Provider
                        </span>
                      </div>
                      <Link href={`/solutions/${solution.id}`}>
                        <button className="inline-flex items-center px-3 py-1.5 border border-primary-500 text-primary-600 text-sm font-medium rounded hover:bg-primary-50">
                          View Details (Login Required)
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No solutions found for this category.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/all-solutions"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              View All Solutions
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsSection;
