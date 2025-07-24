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
      Authorization: 'Basic YWRtaW46em45eVQoQSY5RkR3UiNMRChASkQ3SDc5XXJqMmdRZEM=',
      'Content-Type': 'application/json',
    },
    compression: 'gzip',
  };
  const query = {
    query: {
      term: {
        name: Math.floor(Math.random() * 1000),
      }
    }
  }
  const res = http.post('https://localhost:9243/demo/_search', JSON.stringify(query), params);
  check(res, {
    "status is 200": (res) => res.status === 200,
  });
}
