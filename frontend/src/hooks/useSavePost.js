  import React from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { useState } from 'react';
import { setDate } from 'date-fns';

const useSavePost = (post,onSaveSuccess) => {
    const currentUser = useRecoilValue(userAtom);
    const [saving, setSaving] = useState(false);
    const showToast = useShowToast();
  

    const handleSave = async () => {
        console.log("Post Object:", post); // Check post object
        if (!currentUser) {
            showToast("Error", "You must log in to save a post", "error");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/posts/save/${post.id}`, {  // Updated endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
           
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", `Post saved successfully`, "success");
            onSaveSuccess();

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSaving(false);
           

        }
    };

    return { handleSave, saving};
};

 

/* import React from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { useState } from 'react';

const useSavePost = (post, initialSavedState) => {
    const currentUser = useRecoilValue(userAtom);
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(initialSavedState); // Use initial saved state
    const showToast = useShowToast();

    const handleSave = async () => {
        if (!currentUser) {
            showToast("Error", "You must log in to save a post", "error");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/posts/save/${post.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setIsSaved(true); // Set the post as saved
            showToast("Success", `Post saved successfully`, "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    return { handleSave, saving, isSaved };
}; */

export default useSavePost;




