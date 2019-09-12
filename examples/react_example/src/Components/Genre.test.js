import React from "react";
import { shallow } from "enzyme";
import Genre from './Genre';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';
import NapsterMock from '../Test/NapsterMock';

describe('<Genre/>', () => {
  let wrapper;

  const tracks = {
    id: "1234",
    name: "Hello",
    artist: "Adele",
    type: "track"
  };
  const noTrack = {
    type: "none"
  };

  const queue = [{ id: "1234", name: "Hello", artist: "Adele" }, { id: "1357", name: "Beautiful Girls", artist: "Sean Kingston" }];
  const genre = [{ id: "g.115", name: "Pop", links: { childGenres: { ids: ["g.1"] } } }, { id: "g.5", name: "Rock", links: { childGenres: { ids: ["g.1"] } } }];

  beforeEach(() => {
    GenreCalls.getGenres = jest.fn(() => Promise.resolve(genre));
    TrackCalls.getTracks = jest.fn(() => Promise.resolve(tracks));

    window.Napster = new NapsterMock();

    wrapper = shallow(
      <Genre />
    );
    wrapper.setState({ selectedTrack: tracks });
  });

  it('should render without crashing', () => {
    expect(wrapper);
  });

  describe('loadGenres', () => {
    it('should load genre data', async () => {
      await wrapper.instance().loadGenres();
      expect(GenreCalls.getGenres).toHaveBeenCalled();
      expect(wrapper.state('genres')).toBe(genre);
    });

    it('should render the genre imgs and titles', () => {
      expect(wrapper.find(`div[className^="genre-btn"]`).exists()).toBe(true);
    });
  });

  describe('chooseTrackList', () => {
    it('should load track data', async () => {
      expect(wrapper.state('tracks')).toEqual([]);
      await wrapper.instance().chooseTrackList();
      expect(TrackCalls.getTracks).toHaveBeenCalled();
      expect(wrapper.state('tracks')).toEqual(tracks);
    });
  });

  describe('Select', () => {
    const selectTestId = {
      id: "1111",
    };

    it('should change the state for selected track data if track in queue', () => {
      wrapper.setState({ autoplay: false });
      wrapper.instance().select(tracks);
      expect(wrapper.state('selectedTrack')).toEqual(tracks);
      expect(wrapper.state('currentTrackId')).toEqual(tracks.id);
    });

    it('should change the state for selected track data if track not in queue and shuffle is false', () => {
      wrapper.setState({ autoplay: false });
      wrapper.setState({ tracks: queue });
      wrapper.instance().select(selectTestId);
      expect(wrapper.state('selectedTrack')).toEqual(selectTestId);
      expect(wrapper.state('currentTrackId')).toEqual(selectTestId.id);
      expect(wrapper.state('queue')).toEqual(queue);
      expect(wrapper.state('queueHolder')).toEqual(queue);
    });
  });

  describe('Showing Queue on Click (render logic)', () => {
    it('should show queue and hide tracks when button is turned on', () => {
      wrapper.setState({ isShowing: true });
      expect(wrapper.find(`div[id^='queue']`).exists()).toBe(true);
      expect(wrapper.find(`div[id^='track']`).exists()).toBe(false);
    });

    it('should hide queue and show tracks when button is turned off', () => {
      wrapper.setState({ isShowing: false });
      expect(wrapper.find(`div[id^='queue']`).exists()).toBe(false);
      expect(wrapper.find(`div[id^='track']`).exists()).toBe(true);
    });
  });

  describe('IsPlaying', () => {
    const currentTime = 5;
    const totalTime = 5;
    it('switch playing state', () => {
      wrapper.setState({
        selectedTrack: tracks,
        queue,
        currentTime,
        totalTime,
        repeat: true,
        autoplay: false
      });
      expect(wrapper.state('playing')).toBe(false);
      wrapper.find('Player').props().isPlaying(true);
      expect(wrapper.state('playing')).toBe(true);
    });
  });

  describe('Callback Functions', () => {
    it('should change the state of currentTrackId', async () => {
      expect(wrapper.state('currentTrackId')).toBe("");
      wrapper.find('Player').props().currentTrack(tracks.id);
      expect(wrapper.state('currentTrackId')).toBe(tracks.id);
    });

    it('should change the state of shuffle', () => {
      expect(wrapper.state('shuffle')).toBe(false);
      wrapper.find('Player').props().isShuffled(true);
      expect(wrapper.state('shuffle')).toBe(true);
    });

    it('should change the state of queue', () => {
      expect(wrapper.state('queue')).toEqual([]);
      wrapper.find('Player').props().updateQueue(queue);
      expect(wrapper.state('queue')).toBe(queue);
    });

    it('should change the state of selectedTrack', () => {
      expect(wrapper.state('selectedTrack')).toEqual(tracks);
      wrapper.find('Player').props().songMovement(queue[0]);
      expect(wrapper.state('selectedTrack')).toBe(queue[0]);
    });

    it('should change the state of repeat', () => {
      expect(wrapper.state('repeat')).toBe(false);
      wrapper.find('Player').props().songRepeat(true);
      expect(wrapper.state('repeat')).toBe(true);
    });

    it('should change the state of autoplay', () => {
      expect(wrapper.state('autoplay')).toBe(true);
      wrapper.find('Player').props().trackAutoplay(false);
      expect(wrapper.state('autoplay')).toBe(false);
    });

    describe('showQueue', () => {
      it('should change the state of showing to true', () => {
        wrapper.setState({ selectedTrack: tracks });
        expect(wrapper.state('isShowing')).toBe(false);
        wrapper.find('Player').props().showQueue();
        expect(wrapper.state('isShowing')).toBe(true);
      });

      it('should change the state of showing to false', () => {
        wrapper.setState({ selectedTrack: tracks });
        expect(wrapper.state('isShowing')).toBe(false);
        wrapper.find('Player').props().showQueue();
        expect(wrapper.state('isShowing')).toBe(true);
      });

      it('should return " " if no track is selected', () => {
        wrapper.setState({ selectedTrack: noTrack });
        expect(wrapper.instance().showQueue(false)).toEqual('');
      });
    });
  });
});
