import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "@mui/material";

const BreadCrumbs = ({setSelectedStudent}) => {
  const location = useLocation();

  // Split the pathname into segments
  const pathSegments = location.pathname.split("/").filter((path) => path);

  return (
    <Stack direction="row" spacing={1} sx={{bgcolor: "primary.hover"}}>
      <nav>
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          <li>
            <Link onClick={() => setSelectedStudent('')} to="/find_student" style={{ color: "white" }}>
              Home
            </Link>
            {pathSegments.length > 0 && " / "}
          </li>

          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments
              .slice(0, index + 1)
              .join("/")}`; 

            return (
              <li key={path}>
                <Link onClick={() => segment === 'find_student' && setSelectedStudent('')} to={path} style={{ color: "white" }}>
                  {decodeURIComponent(segment)}
                </Link>
                {index < pathSegments.length - 1 && " / "}
              </li>
            );
          })}
        </ul>
      </nav>
    </Stack>
  );
};

export default BreadCrumbs;
