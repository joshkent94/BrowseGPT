import { FC, useEffect, useState } from 'react'
import { Menu, MenuItem, MenuList } from '@mui/material'
import { Command, commands } from '@utils/misc/commandList'

type CommandsProps = {
    anchor: null | HTMLElement
    setAnchor: (anchor: null | HTMLElement) => void
    searchTerm: string
    selectedCommand: string
    setSelectedCommand: (message: string) => void
}

const Commands: FC<CommandsProps> = ({
    anchor,
    setAnchor,
    searchTerm,
    selectedCommand,
    setSelectedCommand,
}) => {
    const open = Boolean(anchor)
    const [highlightedCommand, setHighlightedCommand] = useState<string | null>(
        null
    )
    const [filteredCommands, setFilteredCommands] = useState<Command[]>(
        commands.sort((a, b) => a.value.localeCompare(b.value))
    )

    const hideCommands = () => {
        setHighlightedCommand(null)
        setAnchor(null)
    }

    const selectCommand = (command: string) => {
        setSelectedCommand(command)
        hideCommands()
    }

    useEffect(() => {
        const trimmedSearchTerm = searchTerm.substring(1)
        if (searchTerm) {
            if (commands.find((command) => command.value === searchTerm)) {
                selectCommand(searchTerm)
                return
            }
            const filtered = commands.filter((command) =>
                command.value
                    .toLowerCase()
                    .includes(trimmedSearchTerm.toLowerCase())
            )
            const sorted = filtered.sort((a, b) =>
                a.value.localeCompare(b.value)
            )
            setFilteredCommands(sorted)
        } else {
            hideCommands()
        }
    }, [searchTerm])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            let currentIndex = filteredCommands.findIndex(
                (command) => command.value === highlightedCommand
            )

            if (event.key === 'ArrowUp') {
                event.preventDefault()
                if (currentIndex === -1) {
                    currentIndex = 0
                } else {
                    currentIndex =
                        (currentIndex - 1 + filteredCommands.length) %
                        filteredCommands.length
                }
                setHighlightedCommand(filteredCommands[currentIndex]?.value)
            } else if (event.key === 'ArrowDown') {
                event.preventDefault()
                if (currentIndex === -1) {
                    return
                } else {
                    currentIndex = (currentIndex + 1) % filteredCommands.length
                }
                setHighlightedCommand(filteredCommands[currentIndex]?.value)
            } else if (event.key === 'Enter') {
                if (currentIndex === -1) {
                    return
                } else {
                    event.preventDefault()
                    selectCommand(filteredCommands[currentIndex].value)
                }
            }
        }

        document.removeEventListener('keydown', handleKeyDown)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [filteredCommands, highlightedCommand])

    useEffect(() => {
        document.querySelector('li.Mui-selected')?.scrollIntoView({
            block: 'nearest',
        })
    }, [highlightedCommand])

    return (
        <>
            {filteredCommands.length > 0 && !selectedCommand && (
                <Menu
                    anchorEl={anchor}
                    open={open}
                    onClose={hideCommands}
                    autoFocus={false}
                    disableAutoFocus
                    slotProps={{
                        paper: {
                            sx: {
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                bottom: '140px !important',
                                left: '58px !important',
                                maxHeight: '300px !important',
                                width: '200px !important',
                                '&::-webkit-scrollbar': {
                                    width: '10px',
                                },
                                '&::-webkit-scrollbar-track-piece': {
                                    margin: '4px 0',
                                },
                                '& .MuiList-root': {
                                    p: 0,
                                },
                                '& .MuiMenuItem-root': {
                                    py: 1.2,
                                    px: 1.8,
                                    fontSize: '14px',
                                    color: 'text.primary',
                                },
                                '& .MuiMenuItem-root:hover': {
                                    backgroundColor:
                                        'rgb(230, 239, 255, 0.7) !important',
                                },
                                '& .Mui-selected': {
                                    backgroundColor:
                                        'rgb(230, 239, 255, 0.7) !important',
                                },
                                '& .Mui-focusVisible': {
                                    backgroundColor:
                                        'rgb(230, 239, 255, 0.7) !important',
                                },
                            },
                            elevation: 0,
                        },
                    }}
                    anchorReference="none"
                >
                    <MenuList dense>
                        {filteredCommands.map((command) => {
                            return (
                                <MenuItem
                                    key={command.value}
                                    tabIndex={0}
                                    selected={
                                        highlightedCommand === command.value
                                    }
                                    onClick={() => selectCommand(command.value)}
                                    className="flex flex-col items-start"
                                >
                                    <div className="">{command.name}</div>
                                    <div className="mt-[1px] text-xs opacity-50">
                                        {command.description}
                                    </div>
                                </MenuItem>
                            )
                        })}
                    </MenuList>
                </Menu>
            )}
        </>
    )
}

export default Commands
