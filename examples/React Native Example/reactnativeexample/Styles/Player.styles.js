import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  selectContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    /*alignItems: 'flex-start',*/
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  color: {
    backgroundColor: '#000000',
  },
  trackContainer: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  track: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    /*alignSelf: 'flex-start'*/
  },
  queue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    alignSelf: 'center'
  },
  image: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
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
});

export { styles }
