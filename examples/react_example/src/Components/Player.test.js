import React from "react";
import { shallow } from "enzyme";
import Player from './Player';
import NapsterMock from '../Test/NapsterMock';

describe('<Player />', () => {
  let wrapper;
  const track = {
    id: "1234",
    type: "track",
    playbackSeconds: 200
  };
  const noTrack = {
    type: "none"
  };
  const queue = [{ id: "1234", name: "Hello", artist: "Adele" }, { id: "1357", name: "Beautiful Girls", artist: "Sean Kingston" }];

  beforeEach(() => {
    window.Napster = new NapsterMock();
    wrapper = shallow(
      <Player
        selectedTrack={track}
        playing={false}
        shuffle={false}
        queue={queue}
        queueHolder={queue}
        isShowing={false}
        currentTime={40}
        totalTime={200}
        currentTrackId={track.id}
        repeat={false}
      />
    );
  });

  it('should render without crashing', () => {
    expect(wrapper);
  });

  describe('Image Place Holder vs. Selected Track Image', () => {
    it('should show place holder if no track selected', () => {
      wrapper = shallow(<Player selectedTrack={noTrack} />);
      expect(wrapper.find(`img[alt^="Album Art"]`).exists()).toBe(false);
      expect(wrapper.find(`img[alt^="NapsterCat"]`).exists()).toBe(true);
    });

    it('should show track image if track selected', () => {
      wrapper = shallow(<Player selectedTrack={track} />);
      expect(wrapper.find(`img[alt^="Album Art"]`).exists()).toBe(true);
      expect(wrapper.find(`img[alt^="NapsterCat"]`).exists()).toBe(false);
    });
  });

  describe('Repeat function and button', () => {
    it('should call repeat function and callbacks in Genre', () => {
      const repeatMock = jest.fn();
      const autoplayMock = jest.fn();
      wrapper = shallow(<Player selectedTrack={track} songRepeat={repeatMock} trackAutoplay={autoplayMock} />);
      wrapper.find(`button[title^='Repeat']`).simulate('click');
      expect(repeatMock).toHaveBeenCalledTimes(1);
      expect(autoplayMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Show Queue Button', () => {
    it('should call show queue callback function in Genre', () => {
      const mock = jest.fn();
      wrapper = shallow(<Player selectedTrack={track} showQueue={mock} />);
      wrapper.find(`button[title^='Show Queue']`).simulate('click');
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('NextPrev', () => {
    it('should make the proper callbacks to Genre if track and next are selected', () => {
      const mockSongMovement = jest.fn();
      const mockIsPlaying = jest.fn();
      const mockCurrentTrack = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          queue={queue}
          songMovement={mockSongMovement}
          isPlaying={mockIsPlaying}
          currentTrack={mockCurrentTrack}
        />
      );
      wrapper.find(`button[title^='Next Song']`).simulate('click');
      expect(mockSongMovement).toHaveBeenCalledTimes(1);
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
      expect(mockCurrentTrack).toHaveBeenCalledTimes(1);
    });

    it('should move backward in queue if track and prev are selected', () => {
      const mockSongMovement = jest.fn();
      const mockIsPlaying = jest.fn();
      const mockCurrentTrack = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          queue={queue}
          songMovement={mockSongMovement}
          isPlaying={mockIsPlaying}
          currentTrack={mockCurrentTrack}
        />
      );
      wrapper.find(`button[title^='Next Song']`).simulate('click');
      expect(mockSongMovement).toHaveBeenCalledTimes(1);
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
      expect(mockCurrentTrack).toHaveBeenCalledTimes(1);
    });

    it('should return an empty string if no track selected', () => {
      wrapper = shallow(<Player selectedTrack={noTrack} />);
      wrapper.find(`button[title^='Previous Song']`).simulate('click');
      expect(wrapper.instance().nextPrev("prev", noTrack)).toEqual('');
    });
  });

  describe('shuffle', () => {
    it('should shuffle queue if track selected and shuffle initially false', () => {
      const mockIsShuffled = jest.fn();
      const mockUpdateQueue = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          shuffle={false}
          isShuffled={mockIsShuffled}
          updateQueue={mockUpdateQueue}
        />
      );
      wrapper.instance().shuffle(queue);
      expect(mockIsShuffled).toHaveBeenCalledTimes(1);
      expect(mockUpdateQueue).toHaveBeenCalledTimes(1);
    });

    it('should shuffle queue if track selected and shuffle initially true', () => {
      const mockIsShuffled = jest.fn();
      const mockUpdateQueue = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          shuffle
          queueHolder={queue}
          isShuffled={mockIsShuffled}
          updateQueue={mockUpdateQueue}
        />
      );
      wrapper.find(`button[title^='Shuffle']`).simulate('click');
      expect(mockIsShuffled).toHaveBeenCalledTimes(1);
      expect(mockUpdateQueue).toHaveBeenCalledTimes(1);
    });

    it('should return an empty string if no track selected', () => {
      wrapper = shallow(<Player selectedTrack={noTrack} />);
      wrapper.find(`button[title^='Shuffle']`).simulate('click');
      expect(wrapper.instance().shuffle(queue)).toEqual('');
    });
  });

  describe('playPauseResume', () => {
    it('track selected, ids match, playing false', () => {
      const mockIsPlaying = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          currentTrackId={track.id}
          playing={false}
          isPlaying={mockIsPlaying}
        />
      );
      wrapper.find(`button[title^='Play']`).simulate('click');
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
    });

    it('track selected, ids match, playing true', () => {
      const mockIsPlaying = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          currentTrackId={track.id}
          playing
          isPlaying={mockIsPlaying}
        />
      );
      wrapper.find(`button[title^='Pause']`).simulate('click');
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
    });

    it('track selected, ids dont match, playing true', () => {
      const mockIsPlaying = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          currentTrackId={queue[1].id}
          playing
          isPlaying={mockIsPlaying}
        />
      );
      wrapper.find(`button[title^='Pause']`).simulate('click');
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
    });

    it('track selected, ids dont match, playing false', () => {
      const mockIsPlaying = jest.fn();
      const mockCurrentTrack = jest.fn();
      wrapper = shallow(
        <Player
          selectedTrack={track}
          currentTrackId={queue[1].id}
          playing={false}
          isPlaying={mockIsPlaying}
          currentTrack={mockCurrentTrack}
        />
      );
      wrapper.find(`button[title^='Play']`).simulate('click');
      expect(mockIsPlaying).toHaveBeenCalledTimes(1);
    });

    it('should return an empty string if no track selected', () => {
      wrapper = shallow(<Player selectedTrack={noTrack} />);
      wrapper.find(`button[title^='Play']`).simulate('click');
      expect(wrapper.instance().playPauseResume(noTrack)).toEqual('');
    });
  });
});
