import React from 'react';
import TextSpan from './TextSpan';

const RecursiveDivs = ({ span }) => {
  if (!span.htmlTag) return <TextSpan attr={span.attr} />;

  if (span.htmlTag === 'h1')
    return (
      <h1>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </h1>
    );
  if (span.htmlTag === 'h2')
    return (
      <h2>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </h2>
    );
  if (span.htmlTag === 'h3')
    return (
      <h3>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </h3>
    );
  if (span.htmlTag === 'h4')
    return (
      <h4>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </h4>
    );
  if (span.htmlTag === 'h5')
    return (
      <h5>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </h5>
    );
  if (span.htmlTag === 'li')
    return (
      <li>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </li>
    );
  if (span.htmlTag === 'ol')
    return (
      <ol>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </ol>
    );
  if (span.htmlTag === 'ul')
    return (
      <ul>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </ul>
    );
  if (span.htmlTag === 'span')
    return (
      <span>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </span>
    );
  if (span.htmlTag === 'a')
    return (
      <a href={'#!'}>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </a>
    );
  if (span.htmlTag === 'em')
    return (
      <em>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </em>
    );
  if (span.htmlTag === 'strong')
    return (
      <strong href={span.attr.href}>
        {span.divs.map((subSpan, index) => (
          <RecursiveDivs key={index} span={subSpan} />
        ))}
      </strong>
    );
  console.log('returning', span.htmlTag, 'as default span element...');
  return (
    <span>
      {span.divs.map((subSpan, index) => (
        <RecursiveDivs key={index} span={subSpan} />
      ))}
    </span>
  );
};
export default RecursiveDivs;
