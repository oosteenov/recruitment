/* @flow */

import React from 'react';
import { graphql } from 'react-relay';
import { Flex } from '@rebass/grid/emotion';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { Link } from '../../controls/link';
import {
  type FragmentRefs,
  createFragment,
  createMutation,
} from '../../controls/relay';
import type { Properties_root } from './__generated__/Properties_root.graphql';

type PropertiesData = {|
  root?: Properties_root,
|};

const PropertiesFragment = createFragment<PropertiesData>(
  graphql`
    fragment Properties_root on Query {
      properties {
        edges {
          node {
            id
            createdAt
            livingSurface
            landSurface
            numberOfRooms
            numberOfParkings
          }
        }
      }
    }
  `
);

const PropertyDeleteProperty = createMutation<
  PropertiesDeleteMutation,
  {}
>(graphql`
  mutation PropertiesDeleteMutation($input: DeletePropertyInput!) {
    deleteProperty(input: $input) {
      deletedPropertyId
    }
  }
`);

type Props = {|
  ...FragmentRefs<PropertyData>,
  step?: string,
|};

const timeSince = date => {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = 'hour';
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = 'minute';
          } else {
            interval = seconds;
            intervalType = 'second';
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType + ' ago';
};

export const Properties = (props: Props) => {
  return (
    <>
      <PropertiesFragment root={props.root}>
        {({ root }) => (
          <Flex alignItems="center" flexDirection="column">
            <div css={{ maxWidth: 960, marginTop: 16, width: '100%' }}>
              <Link href={{ pathname: '/property' }}>
                <Button to="/property" color="primary" variant="contained">
                  Create New
                </Button>
              </Link>
            </div>
            <Paper css={{ maxWidth: 960, marginTop: 16, width: '100%' }}>
              <Toolbar>
                <Flex css={{ width: '100%' }}>
                  <Typography variant="h6">Properties</Typography>
                  <div css={{ flex: 1 }} />
                </Flex>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell numeric>Number Of Rooms</TableCell>
                    <TableCell numeric>Living surface</TableCell>
                    <TableCell numeric>Land surface</TableCell>
                    <TableCell numeric>Number of parkings</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(root.properties.edges || []).map(({ node }) => {
                    return (
                      <TableRow hover key={node.id}>
                        <Link
                          href={{
                            pathname: '/property',
                            query: { propertyId: node.id },
                          }}
                        >
                          <TableCell scope="row">
                            {timeSince(node.createdAt)}
                          </TableCell>
                        </Link>
                        <Link
                          href={{
                            pathname: '/property',
                            query: { propertyId: node.id },
                          }}
                        >
                          <TableCell numeric>{node.numberOfRooms}</TableCell>
                        </Link>
                        <Link
                          href={{
                            pathname: '/property',
                            query: { propertyId: node.id },
                          }}
                        >
                          <TableCell numeric>{node.livingSurface}</TableCell>
                        </Link>
                        <Link
                          href={{
                            pathname: '/property',
                            query: { propertyId: node.id },
                          }}
                        >
                          <TableCell numeric>{node.landSurface}</TableCell>
                        </Link>
                        <Link
                          href={{
                            pathname: '/property',
                            query: { propertyId: node.id },
                          }}
                        >
                          <TableCell numeric>{node.numberOfParkings}</TableCell>
                        </Link>
                        <TableCell>
                          <PropertyDeleteProperty>
                            {({ mutate }) => (
                              <IconButton
                                aria-label="Delete"
                                onClick={() => {
                                  mutate({ propertyId: node.id });
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </PropertyDeleteProperty>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Flex>
        )}
      </PropertiesFragment>
    </>
  );
};
