import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { ForgotPassword } from '../../components/ForgotPassword';

describe('ForgotPassword component should', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ForgotPassword />);
    expect(wrapper.find('div').length).toBe(4);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('input').length).toBe(2);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('span').length).toBe(1);
    expect(wrapper.find('h2').text()).toEqual(' Forgot Password ');
  });
});
