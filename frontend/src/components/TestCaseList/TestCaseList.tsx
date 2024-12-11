import style from '@pages/Test.page.module.css';
import { NavLink } from '@mantine/core';
import React from 'react';
import TestCase from '@models/TestCase';

class TestCaseListProps {
  testCases: TestCase[];
  onChange: Function;
  active: TestCase;

  constructor(testCases: TestCase[], onChange: Function, active: TestCase) {
    this.testCases = testCases;
    this.onChange = onChange;
    this.active = active;
  }
}

export function TestCaseList(props: TestCaseListProps) {
  const { active, onChange } = props;
  return (
    <div>
      {props.testCases.map((item, index) => (
        <NavLink
          key={item.created}
          mb={8}
          className={style.navLink}
          label={item.name}
          active={item.created === active.created}
          onClick={() => onChange(item, index)}
        />
      ))}
    </div>
  );
}
