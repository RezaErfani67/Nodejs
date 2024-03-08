function convertToLookup(relationshipMap) {
    let lookupArray = [];
  
    for (let key in relationshipMap) {
      let lookup = {
        '$lookup': {
          'from': relationshipMap[key].from,
          'localField': relationshipMap[key].localField,
          'foreignField': relationshipMap[key].foreignField,
          'as': key,
        }
      };
  
      if (relationshipMap[key].nested) {
        let nestedLookup = convertToLookup(relationshipMap[key].nested);
        lookup['$lookup']['pipeline'] = nestedLookup;
      }
  
      lookupArray.push(lookup);
    }
  
    return lookupArray;
  }
  
  // Test data
  let relationshipMap = {
    user: {
      from: "user",
      localField: "_id",
      foreignField: "group",
      nested: {
        addresses: { from: "address", localField: "_id", foreignField: "user" },
      },
    },
    test: {
      from: "user",
      localField: "test",
      foreignField: "test",
    },
  };
  
  // Convert to lookup
  let result = convertToLookup(relationshipMap);
  const util = require('util');
  console.log(util.inspect(result, {showHidden: false, depth: null, colors: true}))

  
