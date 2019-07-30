import React from "react";
import { shallow } from "enzyme";
import ProgressBar from './ProgressBar';
import NapsterMock from '../Test/NapsterMock';


describe('<ProgressBar />', () => {
  let wrapper;

  const track = {
    id: "1234",
    type: "track",
    playbackSeconds: 200
  };
  const noTrack = {
    type: "none"
  };

  beforeEach(() => {
    wrapper = shallow(
      <ProgressBar
        selectedTrack={track}
        currentTime={40}
        totalTime={200}
        playing={false}
      />
    );
    window.Napster = new NapsterMock();
  });

  it('should render without crashing', () => {
    expect(wrapper);
  });

  it('should render progress bar on mount', () => {
    expect(wrapper.find(`input`).exists()).toBe(true);
  });

  describe('calculateTotalValue', () => {
    it('should print time in minutes and seconds format if there is a track selected', () => {
      wrapper.instance().calculateTotalValue(track);
      expect(wrapper.instance().calculateTotalValue(track)).toEqual("3:20");
    });

    it('should print 0:00 if there is not a track selected', () => {
      wrapper.instance().calculateTotalValue(noTrack);
      expect(wrapper.instance().calculateTotalValue(noTrack)).toEqual("0:00");
    });
  });

  describe('normalizeTime', () => {
    it('should print time in minutes and seconds format if there is a track selected', () => {
      wrapper.instance().normalizeTime(40);
      expect(wrapper.instance().normalizeTime(40)).toEqual("0:40");
    });

    it('should print 0:00 if currentTime is undefined', () => {
      wrapper.instance().normalizeTime(null);
      expect(wrapper.instance().normalizeTime(null)).toBe("0:00");
    });

    it('should print 0:00 if there is not a track selected', () => {
      wrapper = shallow(<ProgressBar selectedTrack={noTrack} />);
      wrapper.instance().normalizeTime(1);
      expect(wrapper.instance().normalizeTime(1)).toBe("0:00");
    });
  });

  describe('seek', () => {
    const event = {
      target: {
        value: 20
      }
    };

    it('should seek to new time if playing and if track is selected', () => {
      wrapper = shallow(<ProgressBar selectedTrack={track} playing />);
      wrapper.find(`input`).simulate('change', event);
      expect(wrapper.instance().seek(event)).toBe(event.target.value);
    });

    it('should do nothing if no track is selected', () => {
      wrapper = shallow(<ProgressBar selectedTrack={noTrack} />);
      wrapper.find(`input`).simulate('change', event);
      expect(wrapper.instance().seek(event)).toEqual();
    });

    it('should do nothing if not playing', () => {
      wrapper.find(`input`).simulate('change', event);
      expect(wrapper.instance().seek(event)).toEqual();
    });
  });
});
