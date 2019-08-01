import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  selectContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  color: {
    backgroundColor: '#000000',
  },
  selectedTrackName: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  selectedTrackArtist: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#ffffff',
  },
  trackImage: {
    width: 125,
    height: 125
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 12,
  },
  container: {
    backgroundColor: "black",
    marginBottom: 10
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  img: {
    width: 60,
    height: 60,
    marginLeft: 5
  },
  trackName: {
    marginLeft: 5,
    fontWeight: "600",
    color: "white"
  },
  artist: {
    color: "white",
    marginLeft: 5
  },
  queue: {
    alignSelf: 'center',
    fontWeight: "500",
    fontSize: 14,
    color: "white"
  },
  wrap: {
    flexWrap: "wrap",
  },
});

export { styles }
