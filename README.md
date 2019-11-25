# Reviews
This is a ratings & reviews service for an e-commerce site. It supports retrieving reviews, posting a review, marking a review as helpful, and reporting a review. It prioritizes flexibility to allow for iterative, performance-test-driven optimization.

The database schema's degree of normalization is at the optimal middle ground between performance and data integrity. This balance was achieved by methodically normalizing sections of the data one-by-one until performance targets were met. I enabled such a process by investing in a custom logging process to identify errors in the data set (which is over 5,000,000 rows), as well as scripts that fixed common errors.

I containerized all web services with Docker, which makes horizontal scaling nearly effortless. These Docker containers are networked with a least-connceted load balancer.

## Table of contents:
- [Endpoints](#Endpoints)
  * [Sub-heading](#sub-heading)
- [Schema](#Schema)
- [Dev. Process](#Development)
  * [Sub-heading](#sub-heading-2)
