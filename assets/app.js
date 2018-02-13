import DefineMap from 'can-define/map/';

const App = DefineMap.extend({
  title: {
    default: 'Portfolio | Thomas Sieverding',
    serialize: false
  }
});

export default App;
