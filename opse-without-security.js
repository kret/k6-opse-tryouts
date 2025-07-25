import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  insecureSkipTLSVerify: true,
};

export default function() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    compression: 'gzip',
  };
  const query = {
    query: {
      term: {
        age: Math.ceil(Math.random() * 100),
      }
    }
  }
  const res = http.post('http://localhost:9200/beings/_search', JSON.stringify(query), params);
  check(res, {
    "status is 200": (res) => res.status === 200,
  });
}
