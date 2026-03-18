import '../Styles/App.scss';
import '../Styles/FAQ.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function FAQ() {
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false);
  const [expanded3, setExpanded3] = React.useState(false);
  const [expanded4, setExpanded4] = React.useState(false);
  const [expanded5, setExpanded5] = React.useState(false);
  const [expanded6, setExpanded6] = React.useState(false);

  const handleChange1 = (event, isExpanded) => {
    setExpanded1(isExpanded);
  };

  const handleChange2 = (event, isExpanded) => {
    setExpanded2(isExpanded);
  };

  const handleChange3 = (event, isExpanded) => {
    setExpanded3(isExpanded);
  };

  const handleChange4 = (event, isExpanded) => {
    setExpanded4(isExpanded);
  };

  const handleChange5 = (event, isExpanded) => {
    setExpanded5(isExpanded);
  };

  const handleChange6 = (event, isExpanded) => {
    setExpanded6(isExpanded);
  };

  const commonAccordionSx = {
    background: '#111010bb',
    borderRadius: '16px',
    color: 'white',
    '&:not(:last-child)': {
      marginBottom: 2,
    },
    '& .MuiAccordionSummary-root': {
      color: 'white',
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
    '& .MuiTypography-root': {
      fontWeight: 500,
    },
  };
  const container = useRef(null);
  const title = useRef(null);
  const subtitle = useRef(null);
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
          ease: 'power3.out', // smoother easing
        },
      });

      tl.from(title.current, {
        x: -180,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3, // smooth stagger animation
      }).from(subtitle.current, { x: 120, opacity: 0, stagger: 0.3, duration: 0.7 });
    }, container);

    return () => ctx.revert(); // proper cleanup
  }, []);
  return (
    <div className="faq-section" ref={container}>
      <div className="faq-titles">
        <div className="faq-title" ref={title}>
          <h1>
            Got questions? <br />
            We’ve got answers.
          </h1>
        </div>

        <div className="faq-subtitle" ref={subtitle}>
          <p>Here’s everything you need to know before getting started.</p>
        </div>
      </div>
      <Box sx={{ width: '100%' }}>
        <Accordion
          className="accord"
          expanded={expanded1}
          onChange={handleChange1}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded1 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">01</div> What kind of businesses is this template built
              for?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              Clario is designed for SaaS tools, dashboards, fintech platforms, or any digital
              product that needs a modern, conversion-focused landing page. It's fully customizable
              to fit a wide range of web-based services.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="accord"
          expanded={expanded2}
          onChange={handleChange2}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded2 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">02</div> Is the template mobile-friendly and responsive?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              Yes, the template is fully responsive and mobile-friendly. It adapts seamlessly to all
              screen sizes, ensuring optimal viewing experience across devices including desktops,
              tablets, and smartphones.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="accord"
          expanded={expanded3}
          onChange={handleChange3}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded3 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">03</div> Can I use this template without coding skills?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              Absolutely! The template is designed to be user-friendly and can be customized without
              advanced coding knowledge. It comes with intuitive controls and clear documentation to
              help you make changes easily.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="accord"
          expanded={expanded4}
          onChange={handleChange4}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded4 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">04</div> Will I get access to future updates?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              Yes, when you purchase the template, you'll receive all future updates for free. We
              continuously improve and add new features to ensure our template stays current with
              the latest web standards.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="accord"
          expanded={expanded5}
          onChange={handleChange5}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded5 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">05</div> Can I use this template for commercial projects?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              Absolutely! The template comes with a commercial license that allows you to use it in
              your commercial projects. You can create websites for clients or your own business
              without any restrictions.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          className="accord"
          expanded={expanded6}
          onChange={handleChange6}
          sx={commonAccordionSx}
        >
          <AccordionSummary
            expandIcon={
              expanded6 ? (
                <RemoveIcon sx={{ color: '#8cff2e !important' }} />
              ) : (
                <AddIcon sx={{ color: '#8cff2e !important' }} />
              )
            }
            aria-controls="panel6-content"
            id="panel6-header"
          >
            <Typography component="span" className="title-faq">
              <div className="badge-faq">06</div> How can I get support if I run into issues?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="response">
              We provide dedicated support through email and our support ticket system. You can
              reach out to us anytime, and our team will respond within 24-48 hours to help resolve
              any issues you encounter.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  );
}
