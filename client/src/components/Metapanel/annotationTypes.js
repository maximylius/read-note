import React from 'react';
import {
  BsFileText,
  BsFunnel,
  BsQuestion,
  BsLightning,
  BsHash,
  BsThreeDots
} from 'react-icons/bs';
export default {
  note: { type: 'note', placeholder: 'take a note...', icon: <BsFileText /> },
  summary: { type: 'summary', placeholder: 'summarize...', icon: <BsFunnel /> },
  question: {
    type: 'question',
    placeholder: 'question...',
    icon: <BsQuestion />
  },
  idea: { type: 'idea', placeholder: 'annote idea...', icon: <BsLightning /> },
  keyword: {
    type: 'keyword',
    placeholder: 'tag with keyword...',
    icon: <BsHash />
  },
  other: {
    type: 'other',
    placeholder: 'annote other...',
    icon: <BsThreeDots />
  }
};
