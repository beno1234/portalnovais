import React from 'react';
import { Editor, getDefaultKeyBinding, RichUtils } from 'draft-js';
import './index.css';
import '../../../../../../node_modules/draft-js/dist/Draft.css';

class RichTextEditor extends React.Component {
    constructor(props) {
        super(props);
        /* this.state = { editorState: EditorState.createEmpty() }; */

        this.focus = () => this.refs.editor.focus();
        /* this.onChange = (editorState) => this.setState({ editorState }); */

        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.props.onEditorChange(newState);
            return true;
        }
        return false;
    }

    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.props.onEditorChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }

    _toggleBlockType(blockType) {
        this.props.onEditorChange(
            RichUtils.toggleBlockType(
                this.props.editorState,
                blockType
            )
        )
    }

    _toggleInlineStyle(inlineStyle) {
        this.props.onEditorChange(
            RichUtils.toggleInlineStyle(
                this.props.editorState,
                inlineStyle
            )
        );
    }

    render() {
        const editorState = this.props.editorState;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <>
                {
                    this.props.readOnly
                        ? <div className={className}>
                            <Editor
                                blockStyleFn={getBlockStyle}
                                customStyleMap={styleMap}
                                editorState={editorState}
                                ref="editor"
                                readOnly={true}
                            />
                        </div>
                        : <div className="RichEditor-root">
                            <BlockStyleControls
                                editorState={editorState}
                                onToggle={this.toggleBlockType}
                            />
                            <InlineStyleControls
                                editorState={editorState}
                                onToggle={this.toggleInlineStyle}
                            />
                            <div className={className} onClick={this.focus}>
                                <Editor
                                    blockStyleFn={getBlockStyle}
                                    customStyleMap={styleMap}
                                    editorState={editorState}
                                    handleKeyCommand={this.handleKeyCommand}
                                    keyBindingFn={this.mapKeyToEditorCommand}
                                    onChange={this.props.onEditorChange}
                                    placeholder="Era uma vez..."
                                    ref="editor"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                }
            </>
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Citação', style: 'blockquote' },
    { label: 'Lista não ordenada', style: 'unordered-list-item' },
    { label: 'Lista ordenada', style: 'ordered-list-item' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Negrito', style: 'BOLD' },
    { label: 'Itálico', style: 'ITALIC' },
    { label: 'Sublinhado', style: 'UNDERLINE' },
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

export default RichTextEditor;