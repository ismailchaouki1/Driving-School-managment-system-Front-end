import '../Styles/App.scss';
import '../Styles/BlogSection.scss';
import BlogCard from './blogCard';
import { useContext, useEffect, useRef } from 'react';
import { BlogContext } from '../contexts/BlogContext';
import { gsap } from 'gsap';
import { Link } from 'react-router';
export default function BlogSection({ blogpage = true }) {
  const myContext = useContext(BlogContext);
  const mainBlog = myContext.main_blog;
  const BlogList = myContext.blogs;
  const container = useRef(null);
  const title = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 80%', // when section enters viewport
          end: 'bottom 20%',
          toggleActions: 'play none none none', // play once
          scrub: false, // set to true if you want scroll-controlled animation
          // markers: true,     // enable for debugging
        },
        defaults: {
          duration: 1.2,
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from(title.current, {
        x: -180,
        opacity: 0,
        stagger: 0.3, // smooth stagger animation
      });
    }, container);

    return () => ctx.revert(); // proper cleanup
  }, []);
  const blogpage_badge = useRef(null);
  const blogpage_title = useRef(null);
  const blogpage_desc = useRef(null);
  const blogpage_container = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: blogpage_container.current,
          start: 'top 80%', // when section enters viewport
          end: 'bottom 20%',
          toggleActions: 'play none none none', // play once
          scrub: false, // set to true if you want scroll-controlled animation
          // markers: true,     // enable for debugging
        },
        defaults: {
          duration: 1.2,
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from(blogpage_badge.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          blogpage_title.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.4',
        )
        .from(
          blogpage_desc.current,
          {
            y: 60,
            opacity: 0,
            duration: 1.3,
          },
          '-=0.6',
        );
    });

    return () => ctx.revert();
  }, []);
  if (blogpage) {
    return (
      <div className="blog-section" ref={container}>
        <div className="blog-titles">
          <h1 ref={title}>Explore the blog</h1>
          <Link to="/blog" className="nav-link">
            <button className="view-posts-btn rounded-pill">
              View all posts
              <span className="arrow-box">
                {/* FIRST ARROW */}
                <svg
                  className="arrow first"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>

                {/* SECOND ARROW */}
                <svg
                  className="arrow second"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </span>
            </button>
          </Link>
        </div>
        <div className="blogs">
          <div className="first-blog">
            <div className="blog-image">
              <div className="blog-img-div"></div>
            </div>
            {mainBlog.map((blog) => (
              <div className="blog-content" key={blog.id}>
                <div className="blog-badge">
                  <span>{blog.category}</span>
                  <h1>{blog.title}</h1>
                </div>
                <span className="blog-desc">{blog.description}</span>
                <button className="readMore  rounded-pill">
                  Read more
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div className="other-blogs" style={{ marginTop: '20px' }}>
            {BlogList.map((b) => (
              <BlogCard
                className="blog-card"
                key={b.id}
                badge={b.category}
                title={b.title}
                img={b.img}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="blog-section" ref={blogpage_container}>
        <div className="blogpage-titles">
          <div className="blogpage-badge" ref={blogpage_badge}>
            • Blog
          </div>
          <h1 className="blogpage-title" ref={blogpage_title}>
            Insights, guides & updates — all in one place.
          </h1>
          <p className="blogpage-desc" ref={blogpage_desc}>
            Stay ahead with tips on launching, designing, and growing your Driving School.
          </p>
        </div>
        <div className="blogs">
          <div className="first-blog">
            <div className="blog-image">
              <div className="blog-img-div"></div>
            </div>
            {mainBlog.map((blog) => (
              <div className="blog-content" key={blog.id}>
                <div className="blog-badge">
                  <span>{blog.category}</span>
                  <h1>{blog.title}</h1>
                </div>
                <span className="blog-desc">{blog.description}</span>
                <button className="readMore  rounded-pill">
                  Read more
                  <span className="arrow-box">
                    {/* FIRST ARROW */}
                    <svg
                      className="arrow first"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>

                    {/* SECOND ARROW */}
                    <svg
                      className="arrow second"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div className="other-blogs" style={{ marginTop: '20px' }}>
            {BlogList.map((b) => (
              <BlogCard
                className="blog-card"
                key={b.id}
                badge={b.category}
                title={b.title}
                img={b.img}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
