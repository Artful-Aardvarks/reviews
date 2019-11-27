# Reviews

This is a ratings & reviews service for an e-commerce site. It supports retrieving reviews, posting a review, marking a review as helpful, and reporting a review. The business objective was to increase throughput as much as possible while staying under a threshold latency. A personal goal of mine was to minimize data denormalization. I eventually hit all these goals, increasing throughput 400% without execeeding the acceptable latency.

You're going to see the word "iterative" many times in this readme, and that's because it was my exact goal. I'm a believer in fast-moving, performance-test-driven development - tweak, test, and tweak again. To enable this evidence-based optimization, I needed to build a flexible architecture that could gracefully handle changes as fundamental as schema redesign.

I had four main goals for my system:

- Maximize throughput without impacting latency (the original business objective)
- Minize data denormalization
- Horizontaly scale with ease
- Employ strong unit and integration tests to support "moving fast and breaking things" without _actually_ breaking things

## TDD
First I wrote unit and integration tests. There was nothing fancy here, other than the fact that I did it first.

## ETL process with error logging, automated cleanup & automated migration
Then, I invested in a custom error logging system for my ETL process that, using validity checks for each row, would fix common errors (i.e. using 1/0 instead of true/false), and would write uncommon errors to separate logs for manual analysis. I also automated transfering this cleaned data - over 8,000,000 rows across 5 CSVs - to my production server. As a result, it was easy to iteratively denormalize my data and test performance in a production environment.

## Web server optimization
I then went for the low hanging fruit - optimizing my web server's code. The most impactful optimizations were:

- Running asynchronous actions in parallel wherever possible
- Refactoring to prevent using particularly taxing operations, like JSON.parse
- Turning off Sequelize logging (it's the small things you never think about that make the biggest differences!)

## Horizontal scaling & load balancing
My next optimization was horizontal scaling. I containerized all my services with Docker, increased by machine count by 500%, and networked these machines via an NGINX least-connected load balancer.

## Iterative schema design for performance/integrity nirvana
Finally, I was ready to denormalize my data. I started with the tables that seemed 1) had the strongest one-to-one connection with a parent table and 2) was the least likely to benefit from being able to be accessed independently. I went one-by-one until I hit a throughput level that I was satisified with (truthfully, this was a pretty subjective call).

In the end, I had a 400% increase in throughput while maintaining a constant latency, all the while minimizing data denormalization.
