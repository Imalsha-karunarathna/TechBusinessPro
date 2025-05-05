'use client';

import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { BLOG_CATEGORY_COLORS } from '@/lib/constants';
import Link from 'next/link';

const BlogSection = () => {
  const isLoading = true;
  const blogPosts: BlogPost[] = [];

  const getCategoryColor = (category: string) => {
    const colorName =
      BLOG_CATEGORY_COLORS[category as keyof typeof BLOG_CATEGORY_COLORS] ||
      'gray';
    return colorName;
  };

  return (
    <div id="blog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Blog & Insights
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Latest from Tech Mista
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover success stories, technology insights, and market trends
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {isLoading ? (
            // Skeleton loading state
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-24 ml-2" />
                    </div>
                    <div className="mt-2">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="mt-6 flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-36 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
              >
                <img
                  className="h-48 w-full object-cover"
                  src={post.image_url}
                  alt={post.title}
                />
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-${getCategoryColor(
                          post.category,
                        )}-500`}
                      ></span>
                    </div>
                    <div className="ml-2">
                      <p
                        className={`text-sm font-medium text-${getCategoryColor(
                          post.category,
                        )}-600`}
                      >
                        {post.category}
                      </p>
                    </div>
                  </div>
                  <Link href={`/blog/${post.id}`} className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {post.excerpt}
                    </p>
                  </Link>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <Link href={`/author/${post.author_name}`}>
                        <img
                          className="h-10 w-10 rounded-full"
                          src={post.author_image}
                          alt={post.author_name}
                        />
                      </Link>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        <Link href={`/author/${post.author_name}`}>
                          <span className="hover:underline">
                            {post.author_name}
                          </span>
                        </Link>
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.published_at}>
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No blog posts available at this time.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-primary-500 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
          >
            View All Articles
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
  );
};

export default BlogSection;
