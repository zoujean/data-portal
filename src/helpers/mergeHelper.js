/**
 * Convert an array of objects with a key property to an object
 * @param {Array<{key}>} arr array of objects with key field
 */
function array2Map(arr) {
  return arr.reduce(
    (acc, it) => {
      if (! it.key) { throw new Error('arrayToMap entry missing key field!'); }
      acc[it.key] = it;
      return acc;
    }, {}
  );
}


/**
 * Idiosynchratic deep merge - obj2 takes precedence over obj1
 */
function merge(obj1, obj2) {
  if ( ! (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object')) {
    return obj2;
  }
  const keys = [ ...(new Set(Object.keys(obj1).concat(Object.keys(obj2)))) ];
  return keys.reduce(
    (newObj, k) => {
      if (obj1.hasOwnProperty(k) && obj2.hasOwnProperty(k)) {
        const v1 = obj1[k];
        const v2 = obj2[k];
        if (typeof v1 !== typeof v2) {
          newObj[k] = v2;
        } else if (Array.isArray(v1)) {
          if (v1.length && v2.length) {
            // array merge - ugh!
            const sample1 = v1[0];
            const sample2 = v2[0];

            if (typeof sample1 === 'object' && typeof sample2 === 'object' && sample1.hasOwnProperty('key') && sample2.hasOwnProperty('key')) {
              // merge objects with the same key
              const arrAsObj1 = array2Map(v1);
              const arrAsObj2 = array2Map(v2);
              const arrAsObjMerge = merge(arrAsObj1, arrAsObj2);
              newObj[k] = Object.values(arrAsObjMerge);
            } else {
              newObj[k] = v1.concat(v2);
            }
          } else if (v1.length) {
            newObj[k] = v1;
          } else {
            newObj[k] = v2;
          }
        } else if (typeof v1 === 'object') {
          newObj[k] = merge(v1, v2);
        } else if (typeof v1 === 'number') {
          newObj[k] = v1+v2;
        } else {
          newObj[k] = v2;
        }
      } else if (obj2.hasOwnProperty(k)) {
        newObj[k] = obj2[k];
      } else {
        newObj[k] = obj1[k];
      }
      return newObj;
    }, {}
  );
}

const test1 = [
  {"data":{"case":{"hits":{"total":11,"edges":[{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"female","race":"native hawaiian or other pacific islander","id":"Ec8YEWYBDTYFdeVfntmq"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"not reported","race":"other","id":"E88YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":"not hispanic or latino","gender":"unspecified","race":"native hawaiian or other pacific islander","id":"FM8YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"male","race":"not allowed to collect","id":"Fc8YEWYBDTYFdeVfn9me"}},{"node":{"project_id":"DEV-test","ethnicity":"hispanic or latino","gender":"unspecified","race":"other","id":"GM8YEWYBDTYFdeVfoNlS"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"unknown","race":"not allowed to collect","id":"Gs8YEWYBDTYFdeVfodkM"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"unspecified","race":"not reported","id":"Gc8YEWYBDTYFdeVfoNmo"}},{"node":{"project_id":"DEV-test","ethnicity":"not hispanic or latino","gender":"not reported","race":"american indian or alaska native","id":"Es8YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":null,"gender":null,"race":null,"id":"F88YEWYBDTYFdeVfn9n4"}},{"node":{"project_id":"DEV-test","ethnicity":"hispanic or latino","gender":"unspecified","race":"not reported","id":"EM8YEWYBDTYFdeVfntkX"}},{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"unknown","race":"native hawaiian or other pacific islander","id":"Fs8YEWYBDTYFdeVfn9me"}}]}}}},
  {"data":{"case":{"hits":{"total":11,"edges":[{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"female","race":"native hawaiian or other pacific islander","id":"Ec8YEWYBDTYFdeVfntmq"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"not reported","race":"other","id":"E88YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":"not hispanic or latino","gender":"unspecified","race":"native hawaiian or other pacific islander","id":"FM8YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"male","race":"not allowed to collect","id":"Fc8YEWYBDTYFdeVfn9me"}},{"node":{"project_id":"DEV-test","ethnicity":"hispanic or latino","gender":"unspecified","race":"other","id":"GM8YEWYBDTYFdeVfoNlS"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"unknown","race":"not allowed to collect","id":"Gs8YEWYBDTYFdeVfodkM"}},{"node":{"project_id":"DEV-test","ethnicity":"not reported","gender":"unspecified","race":"not reported","id":"Gc8YEWYBDTYFdeVfoNmo"}},{"node":{"project_id":"DEV-test","ethnicity":"not hispanic or latino","gender":"not reported","race":"american indian or alaska native","id":"Es8YEWYBDTYFdeVfn9kk"}},{"node":{"project_id":"DEV-test","ethnicity":null,"gender":null,"race":null,"id":"F88YEWYBDTYFdeVfn9n4"}},{"node":{"project_id":"DEV-test","ethnicity":"hispanic or latino","gender":"unspecified","race":"not reported","id":"EM8YEWYBDTYFdeVfntkX"}},{"node":{"project_id":"DEV-test","ethnicity":"not allowed to collect","gender":"unknown","race":"native hawaiian or other pacific islander","id":"Fs8YEWYBDTYFdeVfn9me"}}]}}}}
];

const test2 = [
  {"case":{"extended":[{"field":"project_id","type":"keyword","displayName":"Project Id","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"ethnicity","type":"keyword","displayName":"Ethnicity","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"gender","type":"keyword","displayName":"Gender","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"race","type":"keyword","displayName":"Race","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}}],"aggregations":{"project_id":{"buckets":[{"doc_count":11,"key_as_string":null,"key":"DEV-test"}]},"ethnicity":{"buckets":[{"doc_count":3,"key_as_string":null,"key":"not allowed to collect"},{"doc_count":3,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"hispanic or latino"},{"doc_count":2,"key_as_string":null,"key":"not hispanic or latino"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]},"gender":{"buckets":[{"doc_count":4,"key_as_string":null,"key":"unspecified"},{"doc_count":2,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"unknown"},{"doc_count":1,"key_as_string":null,"key":"female"},{"doc_count":1,"key_as_string":null,"key":"male"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]},"race":{"buckets":[{"doc_count":3,"key_as_string":null,"key":"native hawaiian or other pacific islander"},{"doc_count":2,"key_as_string":null,"key":"not allowed to collect"},{"doc_count":2,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"other"},{"doc_count":1,"key_as_string":null,"key":"american indian or alaska native"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]}}}},
  {"case":{"extended":[{"field":"project_id","type":"keyword","displayName":"Project Id","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"ethnicity","type":"keyword","displayName":"Ethnicity","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"gender","type":"keyword","displayName":"Gender","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}},{"field":"race","type":"keyword","displayName":"Race","active":true,"isArray":false,"primaryKey":false,"quickSearchEnabled":false,"unit":null,"displayValues":{}}],"aggregations":{"project_id":{"buckets":[{"doc_count":11,"key_as_string":null,"key":"DEV-test"}]},"ethnicity":{"buckets":[{"doc_count":3,"key_as_string":null,"key":"not allowed to collect"},{"doc_count":3,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"hispanic or latino"},{"doc_count":2,"key_as_string":null,"key":"not hispanic or latino"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]},"gender":{"buckets":[{"doc_count":4,"key_as_string":null,"key":"unspecified"},{"doc_count":2,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"unknown"},{"doc_count":1,"key_as_string":null,"key":"female"},{"doc_count":1,"key_as_string":null,"key":"male"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]},"race":{"buckets":[{"doc_count":3,"key_as_string":null,"key":"native hawaiian or other pacific islander"},{"doc_count":2,"key_as_string":null,"key":"not allowed to collect"},{"doc_count":2,"key_as_string":null,"key":"not reported"},{"doc_count":2,"key_as_string":null,"key":"other"},{"doc_count":1,"key_as_string":null,"key":"american indian or alaska native"},{"doc_count":1,"key_as_string":null,"key":"__missing__"}]}}}}
];

const testCases = [test1, test2];

function test() {
  return testCases.map(
    (testList) => {
      const result = merge(testList[0], testList[1]);
      console.log('------------------------------------------------------');
      console.log(JSON.stringify(result, null, '   '));
      return result;
    }
  );
}


//test();