import { Flex, Text } from '@chakra-ui/react';

// Empty component
export default function Empty() {
    return (
        <Flex h='full' align='center' justify='center'>
            <Text color='gray.500' fontSize='lg'>
                Empty
            </Text>
        </Flex>
    );
}
